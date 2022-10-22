import * as Joi from 'joi';

export interface ISubcriber {
    email: string;
}

export const SubscriberSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
});
