//
//  PostViewCell.h
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/20.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PostViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *labelUsername;
@property (weak, nonatomic) IBOutlet UILabel *labelText;

@end
