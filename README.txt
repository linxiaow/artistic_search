1. When ALL is hit, clear all the filters
2. I add a drop-down menu which can be used for sorting
    2.1 price option: sort the items from lowest price to highest
    2.2 collection Name: group by collection Name
    2.3 type: group by type
    2.4 reset: unsort the items
3. add number of result filtered

Comment: 
1. I used v-bind:key but there might be sometimes the description and information togle doesn't work. It is OK for my computer but sometimes CAEN will fail.

2. there is some case that the price is -1 returned by the api. I assume it is no information provided.