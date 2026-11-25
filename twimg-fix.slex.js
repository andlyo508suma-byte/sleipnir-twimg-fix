// ==UserScript==
// @name Twimg Video Link Fix
// @name:ja Twitter動画リンク修正
// @author Chapi
// @description Remove referrer from direct video.twimg.com links.
// @description:ja Twitter動画への直接リンクのリファラを無効にします。
// @include https://*/*
// @include http://*/*
// @version 1.0
// ==/UserScript==
(function () {
  'use strict';
  function fix(a) {
    if (!a || !a.href) return;
    try {
      var u = new URL(a.href, document.baseURI);
      if (u.protocol !== 'https:' || u.hostname !== 'video.twimg.com') return;
      if (!a.relList.contains('noreferrer')) a.relList.add('noreferrer');
      if (a.getAttribute('referrerpolicy') !== 'no-referrer') a.setAttribute('referrerpolicy', 'no-referrer');
    } catch (e) {}
  }
  function scan(root) {
    if (root.nodeType === 1 && root.matches('a[href]')) fix(root);
    if (root.querySelectorAll) root.querySelectorAll('a[href]').forEach(fix);
  }
  scan(document);
  new MutationObserver(function(records) {
    records.forEach(function(r) {
      if (r.type === 'attributes') fix(r.target);
      else r.addedNodes.forEach(scan);
    });
  }).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['href']});
  document.addEventListener('click', function(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    fix(a);
  }, true);
})();
