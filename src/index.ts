import * as assert from 'assert';
import * as fs from 'fs';
import { property } from 'lodash';
import { PROVIDER } from './constants';

export class StackOutputPlugin {

    public readonly hooks: { [key: string]: () => Promise<any> };
    public readonly output: IOutputConfig;

    constructor(private readonly serverless: IServerless) {
        this.hooks = {
            'after:deploy:deploy': () => this._process()
        };
    }

    get stackName() {
        return (this.serverless.getProvider('aws') as any).naming.getStackName();
    }

    get fileName() {
        const {file = 'stack.output.json'} = this.output || {};
        return `${this.serverless.config.servicePath}/${file}`;
    }

    private async _process(): Promise<void> {

        try {

            await this._validate();

            const result = await this._fetch();

            this._handle(await this._beautify(result));

        } catch (e) {
            this.serverless.cli.log(e.message);
        }

    }

    private async _validate() {

        const provider = property('service.provider.name')(this.serverless);
        assert(provider === PROVIDER, 'Provider must be AWS');

    }

    private _fetch(): Promise<IStackDescriptionList> {
        return this.serverless.getProvider(PROVIDER).request(
            'CloudFormation',
            'describeStacks',
            {StackName: this.stackName}
        );
    }

    private _beautify(data: { Stacks: Array<{ Outputs: IStackOutputPair[] }> }) {

        console.dir(data.Stacks);

        const {Outputs = []} = (data.Stacks.pop() || {Outputs: []});

        return Outputs.reduce((obj, item: IStackOutputPair) =>
            ({...obj, [item.OutputKey]: item.OutputValue}));

    }

    private _handle(data: object) {

        const output = JSON.stringify(data, null, 2);

        try {
            fs.writeFileSync(this.fileName, output);
        } catch (e) {
            throw new Error(`Cannot write to file ${this.fileName}`);
        }

    }

}

module.exports = StackOutputPlugin;
