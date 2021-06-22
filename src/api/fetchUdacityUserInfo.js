"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchUdacityUserInfo;

var _config = require("../config");

var _ = require(".");

/**
 * Fetch User information from Udacity API
 * @param {string} udacityAuthToken Udacity authentication token
 */
function fetchUdacityUserInfo(udacityAuthToken) {
  const queryGraphql = '{"query":"\\n    query UserBaseQuery {\\n      user {\\n        id\\n        first_name\\n        last_name\\n        email\\n        nickname\\n        preferred_language\\n        affiliate_program_key\\n        can_see_professional_profile\\n        can_edit_content\\n        \\n  email_preferences {\\n    receive_marketing\\n  }\\n\\n        \\n  settings {\\n    skip_classroom_welcome\\n    dismissed_upgrade_ids\\n    onboarding_completed_keys\\n  }\\n\\n        social_logins {\\n          provider\\n          id\\n        }\\n        user_tags {\\n          namespace\\n          tag\\n        }\\n        nanodegrees(start_index: 0, is_graduated: false) {\\n          id\\n          key\\n          title\\n          locale\\n          version\\n                   user_state {\\n            last_viewed_at\\n          }\\n        }\\n        graduated_nanodegrees: nanodegrees(is_graduated: true) {\\n          id\\n          key\\n          locale\\n          version\\n        }\\n        courses(start_index: 0, is_graduated: false) {\\n          id\\n          key\\n          title\\n          locale\\n          version\\n          semantic_type\\n          user_state {\\n            last_viewed_at\\n          }\\n        }\\n        graduated_courses: courses(is_graduated: true) {\\n          id\\n          key\\n          locale\\n          version\\n        }\\n      }\\n    }\\n  ","variables":null,"locale":"en-us"}';
  return (0, _.fetchApiUdacityGraphql)(_config.API_ENDPOINTS_UDACITY_GRAPHQL, queryGraphql, udacityAuthToken);
}