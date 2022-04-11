#!/bin/sh

# 型定義ファイル格納先
readonly TARGET_PATH=$1
# JSON Schema作成先
readonly DESTINATION_PATH=$2
# 除外条件(ファイル名を正規表現で)
readonly EXCLUSION_CONDITION=$3
readonly TMP_FILE=$(dirname $0)/.tmp
readonly INTERVAL=1

if [ -z $TARGET_PATH ] || [ ! -d $TARGET_PATH ]; then
  echo "[ERROR]Please specify target path as FIRST argument."
  exit
fi

if [ -z $DESTINATION_PATH ] || [ ! -d $DESTINATION_PATH ]; then
  echo "[ERROR]Please specify destination path as SECOND argument."
  exit
fi


trap "rm -f $TMP_FILE" 1 2 3 15


echo "#### START $(basename $0) ####"


cat /dev/null > $TMP_FILE

for f in $(find $TARGET_PATH -type f -name "*.ts"); do
  echo "${f}@@$(ls --full-time $f | awk '{print $6$7}')" >> $TMP_FILE
done

while true; do
  for f in $(find $TARGET_PATH -type f -name "*.ts"); do
    ## 除外条件を指定している & 条件に合致したら処理を飛ばす
    ! -z $EXCLUSION_CONDITION && \
      echo $f | grep -qE $EXCLUSION_CONDITION && \
      continue


    current=$(ls --full-time $f | awk '{print $6$7}')
    last=$(grep -e "${f}@@" $TMP_FILE | awk -F"@@" '{print $2}')

    if [ "$last" != "$current" ]; then
      echo ""
      echo "update: $f"

      if grep -qe "${f}@@${last}" $TMP_FILE; then
        sed -i "s@${last}@${current}@" $TMP_FILE

        # lastが空の場合sedが失敗するので、その行自体書き換え
        if [ $? -ne 0 ]; then
          sed -i -E "s|^${f}@@.*$|${f}@@${current}|" $TMP_FILE
        fi
      else
        echo "${f}@@${current}" >> $TMP_FILE
      fi

      typescript-json-schema $f $(basename $f | cut -d. -f1) --required > ${DESTINATION_PATH}/$(basename $f | sed -e s/\.ts$/.json/)
    fi
  done

  sleep $INTERVAL

  if [ ! -f $TMP_FILE ]; then
    exit
  fi

done