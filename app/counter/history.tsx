import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { PersistedCountdownState, countDownStorageKey } from ".";
import { theme } from "../../them";
import { getFromStorage } from "../../utils/storage";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countDownStorageKey);
      setCountdownState(value);
    };

    init();
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamps || []}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>No History</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {formatDate(item, fullDateFormat)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: theme.colorLightGrey,
  },
  listItemText: {
    fontSize: 18,
    alignSelf: "center",
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
