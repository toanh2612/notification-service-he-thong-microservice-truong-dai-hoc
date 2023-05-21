import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("notification")
export class NotificationEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column("uuid", {
		name: "user_id",
		nullable: false,
	})
	userId: string;

	@Column("uuid", {
		name: "notification_link_id",
		nullable: false,
	})
	notificationLinkId: string;

	@Column({
		name: "is_read",
		default: false,
	})
	isRead: boolean;

	@Column({
		name: "content",
		nullable: false,
		type: "varchar",
	})
	content: string;

	@Column({
		name: "is_deleted",
		default: false,
	})
	isDeleted: boolean;

	@CreateDateColumn({
		type: "timestamp",
		name: "created_date",
		default: () => "CURRENT_TIMESTAMP(6)",
	})
	createdDate: Date;

	@UpdateDateColumn({
		type: "timestamp",
		name: "updated_date",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
	})
	updatedDate: Date;
}
