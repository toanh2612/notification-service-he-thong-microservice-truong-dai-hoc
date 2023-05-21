import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

@Exclude()
export class GetNotificationListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	userId: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	content: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isRead: boolean;
}
