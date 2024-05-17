#!/bin/bash

rooms="family_room patio move garage office"
icon_style="font-size: 600%; margin-top: -10px"

function fixName
{
    echo "$@" | tr "_" " " | sed -e "s/\b\(.\)/\u\1/g"
}
function getIcon
{
    case "$@" in
	family_room)
	    icon="fa-couch"
	    ;;
	patio)
	    icon="mdi-palm-tree"
	    ;;
	move)
	    icon="mdi-speaker"
	    ;;
	garage)
	    icon="mdi-garage"
	    ;;
	office)
	    icon="mdi-monitor"
	    ;;
    esac
    
    echo $icon
}

cat <<EOF
#
# Main arguments, all optional
#
title: Sonos Panel
widget_dimensions: [120, 120]
widget_size: [1, 1]
widget_margins: [5, 5]
scalable: true
columns: 8
global_parameters:
  use_comma: 0 
  precision: 1 
  use_hass_icon: 1
  namespace: default
  devices:
    media_player:
      step: 5

layout:
EOF

filler="nav_to_index"
for add_to in $rooms
do
    printf "  - %s_label(2x1)" $add_to 
    for to_add in $rooms
    do
	if [ "$add_to" != "$to_add" ]
	then
	    printf ", %s_add_%s" $add_to $to_add
	else
	    printf ", $filler"
	fi
    done
    echo ", drop_${add_to}"
    filler=spacer
done

for add_to in $rooms
do
cat <<EOF
drop_${add_to}:
  title: DROP $(fixName $add_to)
  widget_type: script
  icon_on: mdi-speaker-off
  icon_off: mdi-speaker-off
  icon_style_active: "$icon_style"
  icon_style_inactive: "$icon_style"
  entity: "script.drop_${add_to}"

${add_to}_label:
  widget_type: label
  title: "Add this -->"
  title2: "to ↓"
  text: $(fixName $add_to)
  value_style: "font-size: 200%"

EOF
    for to_add in $rooms
    do
	if [ "$add_to" != "$to_add" ]
	then
cat <<EOF

${add_to}_add_${to_add}:
  title: $(fixName ${to_add})
#  title2: (To ${add_to})
  icon_on: $(getIcon $to_add)
  icon_off: $(getIcon $to_add)
  icon_style_active: "$icon_style"
  icon_style_inactive: "$icon_style"
  widget_type: script
  entity: "script.${add_to}_add_${to_add}"
EOF
	fi
    done
    echo ""
	    
done

cat <<EOF
nav_to_index:
  widget_type: navigate
  title: Index
  title2: Dashboard
  dashboard: index
  icon_inactive: fa-list
  icon_active: fa-list
  icon_style_active: "$icon_style"
  icon_style_inactive: "$icon_style"
  sticky: 1

EOF
