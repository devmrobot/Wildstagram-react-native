import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Image, FlatList, StyleSheet } from "react-native";

const FeedScreen: React.FC = () => {
  const [serverImagesUrls, setServerImagesUrls] = useState<string[] | []>([]);

  //console.log("serverImagesUrls =========> : ", serverImagesUrls);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const filesUrl = await axios.get(
            "https://wildstagram.nausicaa.wilders.dev/list"
          );
          //console.log("filesUrl =========> : ", filesUrl);
          //console.log("filesUrl.data =========> : ", filesUrl.data);
          setServerImagesUrls((filesUrl.data).reverse());
        } catch (err) {
          console.log(err);
        }
      })();
    }, [])
  );

  return serverImagesUrls.length > 0 ? (
    <FlatList
      data={serverImagesUrls}
      //data={serverImagesUrls.sort((a,b) => a-b)}
      keyExtractor={(serverImageURI) => serverImageURI}
      renderItem={(itemData) => {
        //console.log("item", itemData);
        return (
          <>
            <Image
              style={styles.image}
              source={{
                uri:
                  "https://wildstagram.nausicaa.wilders.dev/files/" +
                  itemData.item,
              }}
            />
          </>
        );
      }}
    />
  ) : null;
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    height: 500,
  },
});

export default FeedScreen;
