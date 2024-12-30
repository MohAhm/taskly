import { Duration, intervalToDuration, isBefore } from "date-fns";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../them";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";

// 10 seconds from now
const timeStamp = Date.now() + 10 * 1000;

type CounterDownState = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [state, setState] = useState<CounterDownState>({
    isOverdue: false,
    distance: {},
  });
  console.log("🚀 ~ state:", state);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverdue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp }
      );
      setState({ isOverdue, distance });
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app! 📨",
        },
        trigger: {
          seconds: 2,
          channelId: "default",
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Unable to schedule notification",
          "Enable the notifications permission for Expo Go in settings"
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>{secondsElapsed}</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Schedule notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: theme.colorBlack,
  },
  buttonText: {
    letterSpacing: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: theme.colorWhite,
  },
});
