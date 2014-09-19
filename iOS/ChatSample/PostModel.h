//
//  PostModel.h
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/19.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import "BaseModel.h"

@protocol PostModelDelegate

-(void)didSync;
-(void)didSend;

@end


@interface PostModel : BaseModel<NSURLConnectionDataDelegate>

@property (strong) NSString *username;
@property (strong) NSString *text;

+(NSArray *)models;
+(void)setDelegate: (id<PostModelDelegate>)delegate;

-(PostModel *) initWithJSONString: (NSString *) jsonString;
-(PostModel *) initWithDictionary: (NSDictionary *) dictionary;

-(void) configureWithDictionary: (NSDictionary *)dictionary;

+(void)sync;
-(void)send;

@end
