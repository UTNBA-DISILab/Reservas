<?php
/**
 * SAML 2.0 remote IdP metadata for simpleSAMLphp.
 *
 * Remember to remove the IdPs you don't use from this file.
 *
 * See: https://simplesamlphp.org/docs/stable/simplesamlphp-reference-idp-remote 
 */

/*
 * Guest IdP. allows users to sign up and register. Great for testing!
 */
$metadata['http://idp-dev.frba.utn.edu.ar/saml2/idp/metadata.php'] = array (
    'metadata-set' => 'saml20-idp-remote',
    'entityid' => 'http://idp-dev.frba.utn.edu.ar/saml2/idp/metadata.php',
    'SingleSignOnService' =>
        array (
            0 =>
                array (
                    'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
                    'Location' => 'http://idp-dev.frba.utn.edu.ar/saml2/idp/SSOService.php',
                ),
        ),
    'SingleLogoutService' => 'http://idp-dev.frba.utn.edu.ar/saml2/idp/SingleLogoutService.php',
    'certData' => 'MIIFZTCCBE2gAwIBAgIHTuXsltZZeDANBgkqhkiG9w0BAQsFADCBxjELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxJTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMzAxBgNVBAsTKmh0dHA6Ly9jZXJ0cy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5LzE0MDIGA1UEAxMrU3RhcmZpZWxkIFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBHMjAeFw0xMzA5MDIxNzQ4NDlaFw0xNDA5MDIxNzQ4NDlaMEExITAfBgNVBAsTGERvbWFpbiBDb250cm9sIFZhbGlkYXRlZDEcMBoGA1UEAxMTaWRwLmZyYmEudXRuLmVkdS5hcjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANJPg8+6svGbRaftgyAmoPfDs8+6L45aMRomByP6dPYeuVwraFNRbOQB6t9bK6fp4y5S97yWcxJvqf9ZQPM2E4J/5rQvix7u9ESiQ+dj6ek8d5EDItW83u7swgB/GU4MZwFSjOAJf/dcu21Pm/yReBmYxKPnoiNqRnm2tgMriFaO6j2nFlV7cE50WT3U9kPArRWfcCCkWpszTfLiaozqfLcvN5PNoTD4x0E+Vy1dJhxa5kIvBVUXiZS9A4OxR6haAZ3n5A9vWs5Lhj5DLVkJ3rrkFSid4Y4Dw1WSxAAak3j8I8g2HpRiwvSf6AQDC3znM8eBg2XQXshce4GwAjBocPsCAwEAAaOCAdowggHWMA8GA1UdEwEB/wQFMAMBAQAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMA4GA1UdDwEB/wQEAwIFoDA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnN0YXJmaWVsZHRlY2guY29tL3NmaWcyczEtMC5jcmwwWQYDVR0gBFIwUDBOBgtghkgBhv1uAQcXATA/MD0GCCsGAQUFBwIBFjFodHRwOi8vY2VydGlmaWNhdGVzLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkvMIGCBggrBgEFBQcBAQR2MHQwKgYIKwYBBQUHMAGGHmh0dHA6Ly9vY3NwLnN0YXJmaWVsZHRlY2guY29tLzBGBggrBgEFBQcwAoY6aHR0cDovL2NlcnRpZmljYXRlcy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5L3NmaWcyLmNydDAfBgNVHSMEGDAWgBQlRYFoUCY4PTstLL7Natm2PbNmYzA3BgNVHREEMDAughNpZHAuZnJiYS51dG4uZWR1LmFyghd3d3cuaWRwLmZyYmEudXRuLmVkdS5hcjAdBgNVHQ4EFgQUp4Bn261ANT193yMIL4BbdzJsaf0wDQYJKoZIhvcNAQELBQADggEBAHPlkgyR4BgWysFRV5r0uaQlEND87V4PhPIUMxli5L1Kutin1E1hNfg6uxKCqN/ExDlOehW3jXJ4Mms6j8mXaYFviD0g6ehOv4YEk5j51L6bq+b64b81yaqEHI3d1v+b2XNM2t/5BzjQTwVqn/g+XigVfAdrLjfb9ApOnkQ8vtSPbDDX8hfQKzQ6xbJZwaKMn49MjMRR4xItpuSmSn9DPNtX/GMPTS8L63NVjHSnmlzz+tTH5HeiU5cuXwniJI6sqIMwIdHS6ieH4tYExBdKdqdhCb1U1IsptT7N8IIvNK6xEbwmJyEz+CoXHV4ufDFxAwJzt3TBx2sgA6TLVS7GK34=',
    'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
);

