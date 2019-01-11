declare interface IStackOutputPair {
    OutputKey: string;
    OutputValue: string;
}

declare interface IStackDescription {
    Outputs: IStackOutputPair[];
}

declare interface IStackDescriptionList {
    Stacks: IStackDescription[];
}

declare interface IOutputConfig {
    file: string;
}
