import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('varchar', { length: 255 })
    email: string;

    @Column('text')
    password: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
}
