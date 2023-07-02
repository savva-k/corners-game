import { useEffect, useState } from "react";

interface Props {
  url: string;
}

const useAudio = ({ url }: Props): [() => void] => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState<boolean>(false);
  const play = () => {
    setPlaying(false);
    setPlaying(true);
  };

  useEffect(() => {
    if (playing) {
        if (!audio.paused) audio.pause();
        audio.play();
    } else {
        audio.pause();
    } 
  }, [playing, audio]);

  useEffect(() => {
    const listener = () => setPlaying(false);
    audio.addEventListener("ended", listener);
    audio.addEventListener("pause", listener);
    return () => {
      audio.removeEventListener("ended", listener);
      audio.removeEventListener("pause", listener);
    };
  });

  return [play];
};

export default useAudio;
