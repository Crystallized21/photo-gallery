import { Client, Account } from 'appwrite';

export const client = new Client();
client
    .setEndpoint('https://syd.cloud.appwrite.io/v1')
    .setProject('682300dc0024f8473fe0');

const storage = new Storage(client);

const promise = storage.createFile(
    '[BUCKET_ID]',
    ID.unique(),
    document.getElementById('uploader').files[0]
);

promise.then((response) => {
    console.log(response); // Success
}, (error) => {
    console.log(error); // Failure
});