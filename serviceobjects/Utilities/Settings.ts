const config = require("config");

export enum Settings {
    JWTPrivateKey = "JWTPrivateKey",
    DBString = "DBString",
}

export function appConfig(setting: Settings): string {
    return config.get(setting);
}
