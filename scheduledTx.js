import { ScheduleSignTransaction, TransferTransaction, addHbarTransfer } from "@hashgraph/sdk";

const txSchedule = await (
    await new TransferTransaction()
        .addHbarTransfer(multiSignAccountId, Hbar.fromTinybars(-1))
        .addHbarTransfer(client.operatorAccountId, Hbar.fromTinybars(1))
        .schedule()
        .freezeWith(client)
        .addSignature(alicePrivateKey)
).execute(client);

const texScheduleReceipt = await txSchedule.getReceipt(client);

const scheduledId = texScheduleReceipt.scheduleId;
console.log(`Schedule ID: ${scheduledId.toString()}`);

const scheduledTxId = txScheduleReceipt.scheduledTransactionId;
console.log(`Schedule tx ID: ${scheduledTxId.toString()}`);

const txScheduleSign1 = await (
    await new ScheduleSignTransaction()
    .setScheduleId(scheduledId)
    .freezeWith(client)
    .sign(privateKey)
).execute(client)