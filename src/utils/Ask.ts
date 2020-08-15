import readline from 'readline';

export default function ask(question: string, authoriseEmpty = false): Promise<string> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, async answer => {
            rl.close();

            if (answer || authoriseEmpty) {
                resolve(answer);
                return;
            }

            console.log('Answer is mandatory, please respond again.');
            answer = await ask(question, authoriseEmpty);
            resolve(answer);
        });
    });
}