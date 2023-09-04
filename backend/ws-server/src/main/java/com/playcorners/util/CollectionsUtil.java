package com.playcorners.util;

import java.util.HashMap;
import java.util.Map;

public class CollectionsUtil {
    public static <K, V> Map<K, V> copyMap(Map<K, V> source) {
        var copy = new HashMap<K, V>();
        for (var key : source.keySet()) {
            copy.put(key, source.get(key));
        }
        return copy;
    }
}
