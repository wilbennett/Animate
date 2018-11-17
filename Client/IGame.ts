interface IGame {
    update(frame: number, timestamp: number, elapsedTime: number, timeScale: number): void;
    render(frame: number): void;
    stop(): void;
    handleSettingsChanged(): void;
}
