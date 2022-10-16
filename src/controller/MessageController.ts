class MessageController {
  // async getMessages(ctx: Context, next: Next) {
  //     const message: ContactMessage[] = await ContactMessage.find();
  //     ctx.status = 200;
  //     ctx.body = message;
  // }
  // async saveMessage(ctx: Context, next: Next) {
  //     const contactMessage: ContactMessage = new ContactMessage();
  //     const { message, email, mobile, name } = ctx.request.body;
  //     contactMessage.name = name;
  //     contactMessage.email = email;
  //     contactMessage.mobile = mobile;
  //     contactMessage.message = message;
  //     await contactMessage.save();
  //     ctx.body = { message: "saved successfully" };
  //     ctx.status = 200;
  // }
}

export const MessageControllerObj = new MessageController();
