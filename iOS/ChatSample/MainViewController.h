//
//  MainViewController.h
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/20.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PostModel.h"
#import "PostViewController.h"

@interface MainViewController : UIViewController <UITextFieldDelegate, PostModelDelegate>

@property (weak, nonatomic) IBOutlet UIButton *buttonSync;
@property (weak, nonatomic) IBOutlet UIButton *buttonSend;
@property (weak, nonatomic) IBOutlet UITextField *inputUsername;
@property (weak, nonatomic) IBOutlet UITextField *inputText;
@property (weak, nonatomic) IBOutlet UITableView *postView;
@property (strong) PostViewController *postViewController;

- (IBAction)touchButtonSync:(id)sender;
- (IBAction)touchButtonSend:(id)sender;

- (void)didSync;

@end
