import { Toast, open, showHUD, showToast, getPreferenceValues } from "@raycast/api";
import defaultBrowserId from "default-browser-id";
import { runAppleScript } from "run-applescript";
import { getName } from "./getName";
import { Preferences } from "./helpers";

interface Arguments {
  add: string;
}

// This code will run a script to add the event to Fantastical
// It will first check if Fantastical is installed
// If it is not installed, it will show a toast

export default async (props: { arguments: Arguments }) => {
  const args = props.arguments;
  const name = await getName();
  const defaultBrowser = await defaultBrowserId();
  const preferences = getPreferenceValues<Preferences>();
  if (name !== undefined) {
    const escapedAdd = args.add.replace(/"/g, '\\"');
    await runAppleScript(`
        tell application "${name}" 
          parse sentence "${escapedAdd}" with add immediately
        end tell`);

    const optionsSuccess: Toast.Options = {
      style: Toast.Style.Success,
      title: "Event added",
      message: "Your event has been added to Fantastical.",
    };

    // Will check if extension's hide preference is set
    // If true, it will show a HUD, else it will show a toast
    if (preferences.hideOnAdd) {
      showHUD(`Event added`);
    } else {
      showToast(optionsSuccess);
    }
  } else {
    const options: Toast.Options = {
      style: Toast.Style.Failure,
      title: "Fantastical is not installed",
      message: "Please first install Fantastical to use this extension.",
      primaryAction: {
        title: "Install Fantastical",
        onAction: () => {
          open("https://fantastical.app/", defaultBrowser);
        },
      },
    };

    showToast(options);
  }
};
