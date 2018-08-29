interface IGame {
    update(frame: number, timestamp: DOMHighResTimeStamp, delta: number): void;
    render(frame: number): void;
    stop(): void;
    handleSettingsChanged(): void;
}
