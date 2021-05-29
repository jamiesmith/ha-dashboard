#!/bin/bash

room=${1:-family_room}
all=""

function doOne
{
    typeset room="$1"
    typeset playlist="$2"
    typeset logo="$3"
    typeset altName="$4"
    typeset isCD="$5"
    
    niceName="${playlist##*- }"
    
    [ -n "$altName" ] && niceName=$altName
    
    typeset -l varName
    varName="$(echo $niceName | sed 's| |_|g' | tr -d \' | tr -d ':' | tr -d '.' )"
    if [ -z "$logo" ]
    then
	logo=$(echo "${varName}" | sed 's|_|-|g')
    fi
    logo="${logo}.png"
    logo=$(echo "$logo" | sed 's|svg.png|svg|;s|.jpg.png|.jpg|')
    typeset -l commandPrefix
    commandPrefix="$room"
    [ -n "$commandPrefix" ] && commandPrefix="${commandPrefix}_pl_"
    
    label="${playlist##*- }"
    
    niceRoom="$(echo $room | tr "_" " " | sed -e "s/\b\(.\)/\u\1/g")"
    
    playlistName="${commandPrefix}${varName}"
    
    all="$all#  - $playlistName"

    custom=""
    if [ "$isCD" = "CD" ]
    then
	custom="image_style: \"top: 10; bottom: 0; left: 0; right: 0;\""
    fi

cat <<EOF
${playlistName}:
  widget_type: playlist
  entity: media_player.${room}
  title: "$niceName"
  playlist: "$playlist"
  logo: "/custom_css/img/${logo}"
  $custom
EOF
[ -n "$custom" ] && echo ""
}

typeset -l include
echo "# Generated Playlists"
echo "# "
while IFS=, read -r playlist icon altName include isCD
do
    if [ "$include" = "yes" ]
    then
	doOne "$room" "$playlist" "$icon" "$altName" "$isCD"
    else
	echo "# Skip $playlist"
    fi
done < channels.csv

echo $all | tr "#" "\n"
