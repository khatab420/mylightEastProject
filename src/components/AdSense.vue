<template>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-1434018201007541"
       data-ad-slot="3171866545"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</template>

<script>
export default {
  name: "AdSense",
  mounted() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }
};
</script>