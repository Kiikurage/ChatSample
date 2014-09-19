//
//  MainViewController.m
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/20.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController

- (void)viewDidLoad {
	[NSTimer scheduledTimerWithTimeInterval:1.0
									 target:self
								   selector:@selector(update)
								   userInfo:nil
									repeats:YES];
	
	self.inputUsername.delegate = self;
	self.inputText.delegate = self;
	
	self.postViewController = [[PostViewController alloc] init];
	self.postViewController.view = self.postView;
	
	UINib *nib = [UINib nibWithNibName:@"PostViewCell" bundle:nil];
	[self.postView registerNib:nib forCellReuseIdentifier:@"Cell"];
	
	[PostModel setDelegate:self];
	[PostModel sync];
}

- (IBAction)touchButtonSync:(id)sender {
	[PostModel sync];
}

- (IBAction)touchButtonSend:(id)sender {
	PostModel *post = [[PostModel alloc] init];
	post.username = self.inputUsername.text;
	post.text = self.inputText.text;
	[post send];
	
	self.inputText.text = @"";
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
	[self.view endEditing:YES];
	return YES;
}

- (void) didSync {
	[self.postView reloadData];
}

- (void) didSend {
	[PostModel sync];
}

- (void) update {
	[PostModel sync];
}

@end
