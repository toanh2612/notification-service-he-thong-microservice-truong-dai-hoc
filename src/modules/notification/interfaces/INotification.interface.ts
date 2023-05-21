export interface INotification {
	id: string | null | undefined;
	userId: string;
	notificationLinkId: string;
	isRead: boolean;
	content: string;
	isDeleted: boolean;
}
