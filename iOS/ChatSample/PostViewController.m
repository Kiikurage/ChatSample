//
//  PostViewController.m
//  ChatSample
//
//  Created by KikuraYuichiro on 2014/09/20.
//  Copyright (c) 2014年 KikuraYuichiro. All rights reserved.
//

#import "PostViewController.h"

@implementation PostViewController

- (void)setView:(UIView *)view {
	[super setView:view];
	
	((UITableView *)view).dataSource = self;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
	static NSString *CellIdentifier = @"Cell";
	
	PostViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
	
	if (!cell) {
		cell = [[PostViewCell alloc] initWithStyle:UITableViewCellStyleDefault
									  reuseIdentifier:CellIdentifier];
	}
	
	NSArray *models = PostModel.models;
	if (models.count <= indexPath.row) {
		cell.labelUsername.text = @"";
		cell.labelText.text = @"";
	} else {
		PostModel *model = models[indexPath.row];
		cell.labelUsername.text = model.username;
		cell.labelText.text = model.text;
	}
	
	return cell;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
	return PostModel.models.count;
}
@end
