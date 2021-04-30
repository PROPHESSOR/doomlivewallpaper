export enum eSoundChannel {
  CHAN_AUTO = 0,
  CHAN_WEAPON = 1,
  CHAN_VOICE = 2,
  CHAN_ITEM = 3,
  CHAN_BODY = 4,
  CHAN_5 = 5,
  CHAN_6 = 6,
  CHAN_7 = 7
}

export default class Sound {
  public channels: HTMLAudioElement[] = [];

  constructor(channels = 8) {
    for (let i = 0; i < channels; i++) {
      this.channels.push(new Audio());
    }
  }

  play(url: string, channel: number, loop = false) {
    const player = this.channels[channel];

    player.src = url;
    player.loop = loop;
    player.play();
  }
}