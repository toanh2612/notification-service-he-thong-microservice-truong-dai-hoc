import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { parseQuery } from "src/common/utils/utils";
import { GetNotificationListFilterDto } from "./dto/GetNotificationListFilter.dto";
import NotificationService from "./notification.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { OrderType } from "src/common/types/Order.type";
import { CreateNotificationDto } from "./dto/CreateNotification.dto";
import { UpdateNotificationDto } from "./dto/UpdateNotification.dto";

@Controller("/notification")
@ApiTags("notification")
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get("/:id")
  async getOne(@Param("id") id: string) {
    return await this.notificationService.getOne(id);
  }

  @ApiQuery({ name: "filter", type: GetNotificationListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/")
  async getList(@Query() query: QueryCommonDto<GetNotificationListFilterDto>) {
    query = parseQuery(query);

    const order: OrderType = query.order;
    const page = query.page;
    const perPage = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetNotificationListFilterDto = query.filter;
    return await this.notificationService.getList(
      filter,
      order,
      page,
      perPage,
      filterOptions
    );
  }

  @Post("/")
  async create(@Body() createNotificationBody: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationBody);
  }

  @Post("/send-mail")
  async sendMail(@Body() sendMailBody: any) {
    return await this.notificationService.sendMail(sendMailBody);
  }

  @Put("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateNotificationBody: UpdateNotificationDto
  ) {
    return await this.notificationService.update(id, updateNotificationBody);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.notificationService.delete(id);
  }
}
