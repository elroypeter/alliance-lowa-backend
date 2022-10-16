class SubscriberController {
  // async getSubscribers(ctx: Context, next: Next) {
  //     const subscribers: Subscriber[] = await Subscriber.find();
  //     ctx.status = 200;
  //     ctx.body = subscribers;
  // }
  // async saveSubscriber(ctx: Context, next: Next) {
  //     const subscriber: Subscriber = new Subscriber();
  //     subscriber.email = ctx.request.body.email;
  //     await subscriber.save();
  //     ctx.body = { subscriber: "saved successfully" };
  //     ctx.status = 200;
  // }
  // async deleteSubscriber(ctx: Context, next: Next) {
  //     const subscriber: Subscriber = await Subscriber.findOneBy({
  //         id: ctx.params.id,
  //     });
  //     await subscriber.remove();
  //     ctx.body = { subscriber: "removed successfully" };
  //     ctx.status = 200;
  // }
}

export const SubscriberControllerObj = new SubscriberController();
