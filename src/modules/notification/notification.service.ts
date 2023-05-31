import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { NotificationEntity } from "src/common/entities/notification.entity";
import { DataSource } from "typeorm";
import {
  addOrderBy,
  addWhere,
  generateEmailTemplate,
} from "src/common/utils/utils";
import { INotification } from "./interfaces/INotification.interface";
import { CONFIG } from "src/common/configs/config";
import { CONSTANT } from "src/common/utils/constant";
const nodemailer = require("nodemailer");
// var admin = require("firebase-admin");
@Injectable()
export default class NotificationService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async getList(
    filter: any,
    order: any,
    page: number,
    perPage: number,
    filterOptions?: any
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        filterOptions = filterOptions || {};
        const relativeFields: string[] = [];

        let getNotificationListQuery = await this.dataSource
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          // .leftJoinAndSelect("", "")
          .skip((page - 1) * perPage)
          .take(perPage);

        getNotificationListQuery = addWhere(
          getNotificationListQuery,
          filter,
          relativeFields
        );
        getNotificationListQuery = addOrderBy(getNotificationListQuery, order);

        const notificationFoundList: INotification[] =
          await getNotificationListQuery.getMany();
        const notificationFoundCount: number =
          await getNotificationListQuery.getCount();

        return resolve({
          result: notificationFoundList,
          paging: {
            page,
            perPage,
            total: notificationFoundCount,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async getOne(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const notificationFound: INotification = await this.dataSource
          .getRepository(NotificationEntity)
          .findOne({
            where: {
              id,
            },
          });

        return resolve({
          result: notificationFound,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async create(createNotificationData: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let newNotificationData = await queryRunner.manager
          .getRepository(NotificationEntity)
          .create(createNotificationData);

        const newNotificationDataSave: any = await queryRunner.manager
          .getRepository(NotificationEntity)
          .save(newNotificationData);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const newNotificationFound = await this.dataSource
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          .where("notification.id = :id", {
            id: newNotificationDataSave.id,
          })
          .andWhere("notification.is_deleted = false")
          .orderBy("notification.created_date", "DESC")
          .getOne();

        return resovle({
          result: newNotificationFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async update(id: string, updateNotificationData: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let notificationFound = await queryRunner.manager
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          .where("notification.id = :id", {
            id: id,
          })
          .andWhere("notification.is_deleted = false")
          .getOne();

        if (!notificationFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(NotificationEntity)
          .createQueryBuilder()
          .update(NotificationEntity)
          .set(updateNotificationData)
          .where("id = :id", { id: notificationFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        notificationFound = await this.dataSource
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          .where("notification.id = :id", {
            id: notificationFound.id,
          })
          .andWhere("notification.is_deleted = false")
          .getOne();

        return resovle({
          result: notificationFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async delete(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let notificationFound = await queryRunner.manager
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          .where("notification.id = :id", {
            id: id,
          })
          .andWhere("notification.is_deleted = false")
          .getOne();

        if (!notificationFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(NotificationEntity)
          .createQueryBuilder()
          .update(NotificationEntity)
          .set({
            isDeleted: true,
          })
          .where("id = :id", { id: notificationFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        notificationFound = await this.dataSource
          .getRepository(NotificationEntity)
          .createQueryBuilder("notification")
          .where("notification.id = :id", {
            id: notificationFound.id,
          })
          .andWhere("notification.is_deleted = false")
          .getOne();

        return resovle({
          result: notificationFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async sendMail(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const { user, subject, text, html } = params;
        const templateHtml = generateEmailTemplate({
          host: CONFIG["WEBSITE"],
          role: user.role,
          content: text,
          buttonText: "Link",
        });
        const { personalEmail } = user;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: CONFIG["MAIL_USERNAME"],
            pass: CONFIG["MAIL_PASSWORD"],
          },
        });

        await transporter.sendMail({
          from: `📧 ${CONSTANT.APP_NAME} - ${CONFIG["MAIL_USERNAME"]}`,
          to: personalEmail,
          subject,
          text,
          html: html || templateHtml,
        });

        return resolve({
          result: true,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async pushNotification() {
    // var serviceAccount = path.resovle(
    //   process.cwd(),
    //   "firebase-account-key.json"
    // );
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    // });
    // admin.messaging().send({
    //   notifcation: {
    //     title: "title",
    //     body: "body",
    //   },
    //   token: "",
    // });
  }
}
