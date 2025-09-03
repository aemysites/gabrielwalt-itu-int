/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
(() => {
  // Main page content is wrapped into a form and this is breaking page decomposition
  // in AEMY.
  // Solution here is to replace it with a div.
  var fPage = document.querySelector('#aspnetForm');
  if (fPage) {
    var d = document.createElement('div');
    var c = fPage.firstElementChild;
    while (c) {
        d.append(c);
        c = fPage.firstElementChild;
    }
    fPage.replaceWith(d);
  }
})();
