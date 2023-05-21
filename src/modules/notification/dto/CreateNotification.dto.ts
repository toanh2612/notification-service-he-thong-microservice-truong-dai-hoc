import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateNotificationDto {
	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	notificationLinkId: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty()
	isRead: boolean;

	@ApiProperty()
	@Expose()
	@IsNotEmpty()
	content: string;
}
