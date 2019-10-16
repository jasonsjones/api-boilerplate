import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Error {
    @Field()
    path: string;

    @Field()
    message: string;
}

@ObjectType()
export class MutationResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [Error], { nullable: true })
    error?: Error[];
}
