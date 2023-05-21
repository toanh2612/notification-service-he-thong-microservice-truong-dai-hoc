import { CONFIG } from "../configs/config";

export const CONSTANT = {
  SERVICE_NAME: CONFIG.SERVICE_NAME,
  APP_NAME: "EDU-MICORSERVICE.SITE",
  EVENT: {
    USER: {
      GET_USER_LIST_BY_IDS: "USER.GET_USER_LIST_BY_IDS",
      GET_USER_BY_ID: "USER.GET_USER_BY_ID",
      AUTH: "USER.AUTH",
    },
    SCHEDULE: {
      UPDATE_CLASSROOM_SUCCESSED: "SCHEDULE.UPDATE_CLASSROOM",
      UPDATE_CLASS_PERIOD_SUCCESSED: "SCHEDULE.UPDATE_CLASS_PERIOD",
      UPDATE_CLASS_PERIOD_TIME_RANGE_SUCCESSED:
        "SCHEDULE.UPDATE_CLASS_PERIOD_TIME_RANGE",
      CREATE_ATTENDANCE_SUCCESSED: "SCHEDULE.CREATE_ATTENDANCE_SUCCESSED",
      UPDATE_ATTENDANCE_SUCCESSED: "SCHEDULE.UPDATE_ATTENDANCE_SUCCESSED",
      REGISTER_CLASSROOM_INIT: "SCHEDULE.REGISTER_CLASSROOM_INIT",
      CANCEL_CLASSROOMS: "SCHEDULE.CANCEL_CLASSROOMS",
    },
    PAYMENT: {
      PAYMENT_CREATION_SUCCESSED: "PAYMENT.PAYMENT_CREATION_SUCCESSED",
      PAYMENT_CREATION_FAILED: "PAYMENT.PAYMENT_CREATION_FAILED",
      PAYMENT_SUCCESSED: "PAYMENT.PAYMENT_SUCCESSED",
      PAYMENT_FAILED: "PAYMENT.PAYMENT_FAILED",
    },
    NOTIFICATION: {},
  },
  CALL_OTHER_SERVICE_TIMEOUT: 10000,
  RABBITMQ: {
    CONNECTION_URL: `amqp://${CONFIG["RABBITMQ_USERNAME"]}:${CONFIG["RABBITMQ_PASSWORD"]}@${CONFIG["RABBITMQ_HOST"]}`,
    EXCHANGE_NAME: "TOPIC",
  },
  ERROR: {
    SYSTEM: {
      GENERAL_ERROR: {
        code: "E0000",
        httpStatusCode: 500,
        message: "General error",
      },
      CONNECT: {
        RABBITMQ: {
          code: "E0005",
          httpStatusCode: 500,
          message: "Can't conntect rabbitMQ",
        },
      },
    },
    USER: {
      LOGIN: {
        USERNAME_EMAIL_INVALID: {
          code: "E0001",
          httpStatusCode: 402,
          message: "Invalid username or email",
        },
        PASSWORD_IS_WRONG: {
          httpStatusCode: 401,
          message: "Password is wrong",
        },
      },
      NOT_FOUND: {
        code: "E0002",
        httpStatusCode: 404,
        message: "User not found",
      },
      NOT_PERMISSION: {
        code: "E0004",
        httpStatusCode: 403,
        message: "Not permission",
      },
      UNAUTHORIZATED: {
        code: "E0006",
        httpStatusCode: 401,
        message: "Unauthorizated",
      },
    },
    PAYMENT: {
      NOT_FOUND: {
        code: "E0007",
        httpStatusCode: 404,
        message: "Payment not found",
      },
    },
    CLASSROOM_STUDENT: {
      REGISTERED_CLASSROOM: {
        code: "E0008",
        httpStatusCode: 409,
        message: "Registered classroom",
      },
    },
  },
  EVENT_STORE: {
    QUERY_TYPE: {
      INSERT: "INSERT",
      UPDATE: "UPDATE",
      DELETE: "DELETE",
    },
    STATUS: {
      COMMIT: "COMMIT",
      ROLLBACK: "ROLLBACK",
    },
    ENTITY_TYPE: {
      PAYMENT: "PAYMENT",
      PAYMENT_DETAIL: "PAYMENT_DETAIL",
      CLASSROOM_STUDENT: "CLASSROOM_STUDENT",
    },
  },
  ENTITY: {
    PAYMENT: {
      STATUS: {
        CANCELED: "CANCELED",
        REFUND: "REFUND",
        CREATED: "CREATED",
        AWAITTING_PAYMENT: "AWAITTING_PAYMENT",
        FINISHED: "FINISHED",
      },
      PAYMENT_TYPE: {
        ZALO_PAY: "ZALO_PAY",
      },
    },
    CLASSROOM_STUDENT: {
      STATUS: {
        PENDING: "PENDING",
        AWAITTING_PAYMENT: "AWAITTING_PAYMENT",
        AWAITTING_CREATE_PAYMENT: "AWAITTING_CREATE_PAYMENT",
        FINISHED: "FINISHED",
      },
    },
  },
};
