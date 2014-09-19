//
//  PostModel.m
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/19.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import "PostModel.h"

#define URLSyncPost @"http://silverlance.sakura.ne.jp/wolfman/php/get.php?key=chat"
#define URLSendPost @"http://silverlance.sakura.ne.jp/wolfman/php/set.php"

@implementation PostModel

typedef enum {
	RequestModeSleep,
	RequestModeSync,
	RequestModeSend
} RequestMode;

static NSArray *_models;
static id<PostModelDelegate> _delegate;
static RequestMode requestMode;
static NSMutableData *dataConnectionResponse;



+(NSArray *) models {
	return _models ? _models : [NSArray array];
}

+(void)setDelegate: (id<PostModelDelegate>) delegate {
	_delegate = delegate;
};



#pragma mark - initializer

-(PostModel *) initWithJSONString: (NSString *) jsonString {
	NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
	NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:nil];
	return [self initWithDictionary:dict];
}

-(PostModel *) initWithDictionary: (NSDictionary *) dictionary {
	self = [self init];
	[self configureWithDictionary:dictionary];
	return self;
}



#pragma mark - config operation

-(void) configureWithDictionary: (NSDictionary *)dictionary {
	for (NSString *key in dictionary) {
		if ([self respondsToSelector:NSSelectorFromString(key)]) {
			[self setValue:dictionary[key] forKeyPath:key];
		}
	}
}

-(NSDictionary *) convertToDictionary {
	NSMutableDictionary *res = [NSMutableDictionary dictionary];
	[res setValue:self.username forKey:@"username"];
	[res setValue:self.text forKey:@"text"];
	
	return res;
}



#pragma mark - communication with server

+(void) sync {
	if (requestMode != RequestModeSleep) return;
	requestMode = RequestModeSync;
	
	NSURL *url = [NSURL URLWithString:URLSyncPost];
	NSURLRequest *request = [NSURLRequest requestWithURL:url];
	
	dataConnectionResponse = [NSMutableData data];
	
	PostModel *dummy = [[PostModel alloc] init];
	NSURLConnection *connection = [NSURLConnection connectionWithRequest:request delegate:dummy];
	[connection start];
}

-(void) send {
	if (requestMode != RequestModeSleep) return;
	requestMode = RequestModeSend;
	
	NSURL *url = [NSURL URLWithString:URLSendPost];
	NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
	
	request.HTTPMethod = @"POST";
	[request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField: @"Content-type"];
	
	NSDictionary *postDataDict = [self convertToDictionary];
	NSData *postData = [NSJSONSerialization dataWithJSONObject:postDataDict options:NSJSONWritingPrettyPrinted error:nil];
	NSString *postString = [[NSString alloc] initWithData:postData encoding:NSUTF8StringEncoding];
	
	NSString *bodyString = [self createURLParameterString:
							@{@"key": @"chat",
							  @"val": postString}];
	request.HTTPBody = [bodyString dataUsingEncoding:NSUTF8StringEncoding];
	
	dataConnectionResponse = [NSMutableData data];
	
	NSURLConnection *connection = [NSURLConnection connectionWithRequest:request delegate:self];
	[connection start];
}



# pragma mark - Implements for NSURLConnectionDataDelegate

- (NSString *) createURLParameterString: (NSDictionary *)dictionary {
	NSMutableArray *tokens = [[NSMutableArray alloc] init];
	
	for (NSString *key in dictionary) {
		NSString *val = [dictionary valueForKey:key];
		val = [val stringByAddingPercentEncodingWithAllowedCharacters:
			   [NSCharacterSet alphanumericCharacterSet]];
		[tokens addObject: [NSString stringWithFormat:@"%@=%@", key, val]];
	}
	
	return [tokens componentsJoinedByString: @"&"];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
	[dataConnectionResponse appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
	NSString *strResponse = [[NSString alloc] initWithData:dataConnectionResponse encoding:NSUTF8StringEncoding];
	
	switch (requestMode) {
		case RequestModeSend:
			[_delegate didSend];
			break;
			
		case RequestModeSync:
			[self parseJSONString: strResponse];
			break;
			
		default:
			break;
	}
	
	requestMode = RequestModeSleep;
}

- (void)parseJSONString: (NSString *) jsonString {
	NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
	NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:nil];
	NSMutableArray *arr = [NSMutableArray array];
	NSArray *postDictionaries= (NSArray *)[dict valueForKey:@"posts"];
	
	for (NSDictionary *postDictionary in postDictionaries) {
		PostModel *post = [[PostModel alloc] initWithDictionary:postDictionary];
		[arr addObject:post];
	}
	
	_models = arr;
	[_delegate didSync];
}

@end
