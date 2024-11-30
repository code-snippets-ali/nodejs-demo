const config = require("config");

export enum Settings {
    JWTPrivateKey = "JWTPrivateKey",
    DBString = "DBString",
    DBString_Test = "DBString_Test",
    Name = "name",
}

export function appConfig(setting: Settings): string {
    return config.get(setting);
}
