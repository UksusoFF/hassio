#!/bin/bash

# This script do some things for post videos from DVR to Slack.
#
# It`s tested on Rapsperry Pi 3 and hass.io enviroment and contains following steps:
# * download ffmpeg (if required);
# * extract Slack token from `/config/secrets.yaml`;
# * check new files uploaded from DVR;
# * convert to mp4, upload to Slack and delete it.
#
# Pre-Requirements:
# https://github.com/hassio-addons/addon-ftp - for upload videos from DVR;
# Slack Token in `/config/secrets.yaml`

set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

TARGET_DIR="$SCRIPT_DIR/bin"
DECODE_DIR="$SCRIPT_DIR/_decode"

FFMPEG_ARCH_PATH="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-armhf-static.tar.xz"
FFMPEG_ARCH_NAME=$(basename "$FFMPEG_ARCH_PATH")

SLACK_TOKEN_KEY="slack_token"
SLACK_CHANNEL="#keyroom"

DVR_IP="192.168.1.10"
DVR_ID="0012169e66b0"
CAM_CHANNEL="04"

SLACK_TOKEN=$(cat "/config/secrets.yaml" 2>/dev/null | grep $SLACK_TOKEN_KEY)
SLACK_TOKEN=$(echo $SLACK_TOKEN | sed -e "s/$SLACK_TOKEN_KEY: //")

mkdir -p "$TARGET_DIR"
mkdir -p "$DECODE_DIR"
echo "*" >"$TARGET_DIR/.gitignore"

if [ ! -f "$TARGET_DIR/ffmpeg" ]; then
  TEMP="$TARGET_DIR/_temp"
  wget "$FFMPEG_ARCH_PATH" -P "$TARGET_DIR" 2>/dev/null
  mkdir -p "$TEMP"
  tar --extract --file "$TARGET_DIR/$FFMPEG_ARCH_NAME" --strip-components=1 -C "$TEMP"
  mv "$TEMP/ffmpeg" "$TARGET_DIR/ffmpeg"
  rm -rf "$TEMP"
  rm -rf "$TARGET_DIR/$FFMPEG_ARCH_NAME"
  chmod +x "$TARGET_DIR/ffmpeg"
fi

for F in $(ls -1 /share/${DVR_IP}_${DVR_ID}/*/$CAM_CHANNEL/rec/*.h264); do
  echo "$F"
  NAME=$(basename "$F" ".h264")
  "$TARGET_DIR/ffmpeg" -framerate 24 -i "$F" -c copy "$DECODE_DIR/$NAME.mp4"
  curl -F file=@"$DECODE_DIR/$NAME.mp4" -F channels="$SLACK_CHANNEL" -H "Authorization: Bearer $SLACK_TOKEN" https://slack.com/api/files.upload
  rm -rf "$DECODE_DIR/$NAME.mp4"
  rm -rf "$F"
done
