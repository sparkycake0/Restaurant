// S3Properties.java

package com.spacecode.server;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "neon.storage")
public record S3Properties(
    String endpoint, String region, String accessKey, String secretKey, String bucket) {}
