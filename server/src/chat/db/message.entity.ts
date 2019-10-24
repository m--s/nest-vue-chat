import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn} from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ length: 100 })
    roomId: string;

    @Column({ length: 100 })
    from: string;

    @Column({ length: 100 })
    fromId: string;

    @Column({ length: 100, default: 'host' })
    to: string;

    @Column('text')
    text: string;

    @CreateDateColumn()
    createdAt: string;

    constructor( props?: {roomId?: string, from?: string, fromId?: string, to?: string, text?: string}) {
        if (props) {
            this.roomId = props.roomId;
            this.from = props.from;
            this.fromId = props.fromId;
            this.to = props.to;
            this.text = props.text;
        }
    }
}
