import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, FlatList, Image, StyleSheet, Button } from "react-native";
import singleFileUploader from "single-file-uploader";
import Constants from "expo-constants";

const ImageScreen: React.FC = () => {

  const [imagesURI, setImagesURI] = useState<string[] | void>([]);

  console.log("imagesURI =========> : ", imagesURI);
  // console.log("Constants?.manifest?.extra =========> : ", Constants);
  // console.log("Constants?.manifest?.extra =========> : ", Constants?.manifest);
  // console.log("Constants?.manifest?.extra =========> : ", Constants?.manifest?.extra);
  // console.log("Constants?.manifest?.extra?.token =========> : ", Constants?.manifest?.extra?.token);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const images: string[] = await FileSystem.readDirectoryAsync(
            FileSystem.cacheDirectory + "ImageManipulator"
          );
          setImagesURI(images);
        } catch (err) {
          alert("No pics for now");
        }
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      {imagesURI && imagesURI.length > 0 ? (
        <FlatList
          data={imagesURI}
          keyExtractor={(imageURI) => imageURI}
          renderItem={(itemData) => {
            //console.log("itemData =========> : ", itemData);
            //console.log("itemData.item =========> : ", itemData.item);
            console.log(FileSystem.cacheDirectory + "ImageManipulator/" + itemData.item);
            return (
              <>
                <Image
                  style={styles.image}
                  source={{
                    uri:
                      FileSystem.cacheDirectory +
                      "ImageManipulator/" +
                      itemData.item,
                  }}
                />
                <Button
                  title="upload"
                  onPress={async () => {
                    try {
                      await singleFileUploader({
                        distantUrl:
                          "https://wildstagram.nausicaa.wilders.dev/upload",
                        expectedStatusCode: 200,
                        filename: itemData.item,
                        filetype: "image/jpg",
                        formDataName: "fileData",
                        localUri: FileSystem.cacheDirectory + "ImageManipulator/" + itemData.item,
                        token: Constants?.manifest?.extra?.token,
                      });
                      alert("Uploaded");
                    } catch (err) {
                      alert("Error");
                      //console.log("err =========> : ", err);
                    }
                  }}
                />
              </>
            );
          }}
        />
      ): null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    resizeMode: "cover",
    height: 500,
  },
});

export default ImageScreen;
