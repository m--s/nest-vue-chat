export default interface SendMessageBody {
    fromId: string;
    from: string;
    to?: string;
    text: string;
}