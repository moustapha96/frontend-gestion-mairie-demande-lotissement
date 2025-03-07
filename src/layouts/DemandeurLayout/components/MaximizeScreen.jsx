import { useState } from "react";
import { LuMaximize, LuMinimize } from "react-icons/lu";

const MaximizeScreen = () => {
  const [fullScreenOn, setFullScreenOn] = useState(false);

  /*
   * toggle full screen mode
   */
  const toggleFullScreen = () => {
    const document = window.document;
    document.body.classList.add("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
      setFullScreenOn(true);
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      setFullScreenOn(false);
    }

    // handle fullscreen exit
    const exitHandler = () => {
      if (
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      )
        document.body.classList.remove("fullscreen-enable");
    };
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
  };
  return (
    <button
      onClick={toggleFullScreen}
      type="button"
      className="inline-flex size-9 flex-shrink-0 items-center justify-center gap-2 rounded-md align-middle font-medium text-zinc-200 transition-all duration-300 hover:bg-white/10"
    >
      {fullScreenOn ? (
        <LuMinimize className="size-5" />
      ) : (
        <LuMaximize className="size-5" />
      )}
    </button>
  );
};

export default MaximizeScreen;
