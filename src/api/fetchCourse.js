"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchCourse;

var _config = require("../config");

var _ = require(".");

/**
 * Fetch JSON data of a course from Udacity API
 * @param {string} courseInfo course information
 * @param {string} udacityAuthToken Udacity authentication token
 */
function fetchCourse(courseInfo, udacityAuthToken) {
  const {
    key
  } = courseInfo;
  const queryGraphql = `
    {\"query\":\"\\n    query CourseQuery {\\n      course(key: \\\"${key}\\\" version: \\\"1.0.0\\\" locale: \\\"en-us\\\") {\\n        id\\n        key\\n        version\\n        locale\\n        semantic_type\\n        forum_path\\n        title\\n        is_public\\n        is_default\\n        \\n  user_state {\\n    node_key\\n    completed_at\\n    last_viewed_at\\n    unstructured\\n  }\\n\\n        \\n  resources {\\n    files {\\n      name\\n      uri\\n    }\\n    google_plus_link\\n    career_resource_center_link\\n    coaching_appointments_link\\n    office_hours_link\\n    aws_provisioning_link\\n  }\\n\\n        instructors {\\n          \\n  image_url\\n  first_name\\n\\n        }\\n        project_deadline {\\n          \\n  due_at\\n  node_key\\n\\n        }\\n        project {\\n          \\n  key\\n  version\\n  locale\\n  duration\\n  semantic_type\\n  title\\n  description\\n  is_public\\n  summary\\n  forum_path\\n  rubric_id\\n  terminal_project_id\\n  \\n  resources {\\n    files {\\n      name\\n      uri\\n    }\\n    google_plus_link\\n    career_resource_center_link\\n    coaching_appointments_link\\n    office_hours_link\\n    aws_provisioning_link\\n  }\\n\\n  \\n  image {\\n    url\\n    width\\n    height\\n  }\\n\\n\\n        }\\n        \\n  aggregated_state {\\n    node_key\\n    completion_amount\\n    completed_count\\n    concept_count\\n    last_viewed_child_key\\n    lesson_aggregated_states {\\n      node_key\\n      completed_at\\n      completion_amount\\n      completed_count\\n      concept_count\\n      last_viewed_child_key\\n    }\\n  }\\n\\n        lessons {\\n          \\n  id\\n  key\\n  version\\n  locale\\n  semantic_type\\n  summary\\n  title\\n  duration\\n  is_public\\n  is_project_lesson\\n  display_workspace_project_only\\n  lesson_type\\n\\n          \\n  image {\\n    url\\n    width\\n    height\\n  }\\n\\n          \\n  resources {\\n    files {\\n      name\\n      uri\\n    }\\n    google_plus_link\\n    career_resource_center_link\\n    coaching_appointments_link\\n    office_hours_link\\n    aws_provisioning_link\\n  }\\n\\n          concepts {\\n            id\\n            key\\n            is_public\\n            semantic_type\\n            title\\n            \\n  user_state {\\n    node_key\\n    completed_at\\n    last_viewed_at\\n    unstructured\\n  }\\n\\n            \\n  resources {\\n    files {\\n      name\\n      uri\\n    }\\n    google_plus_link\\n    career_resource_center_link\\n    coaching_appointments_link\\n    office_hours_link\\n    aws_provisioning_link\\n  }\\n\\n          }\\n          project {\\n            \\n  key\\n  version\\n  locale\\n  duration\\n  semantic_type\\n  title\\n  description\\n  is_public\\n  summary\\n  forum_path\\n  rubric_id\\n  terminal_project_id\\n  \\n  resources {\\n    files {\\n      name\\n      uri\\n    }\\n    google_plus_link\\n    career_resource_center_link\\n    coaching_appointments_link\\n    office_hours_link\\n    aws_provisioning_link\\n  }\\n\\n  \\n  image {\\n    url\\n    width\\n    height\\n  }\\n\\n\\n            \\n  project_state {\\n    state\\n    submissions {\\n      created_at\\n      url\\n      result\\n      is_legacy\\n      id\\n      status\\n    }\\n  }\\n\\n          }\\n        }\\n      }\\n    }\\n  \",\"variables\":null,\"locale\":\"en-us\"}
  `;
  return (0, _.fetchApiUdacityGraphql)(_config.API_ENDPOINTS_UDACITY_GRAPHQL, queryGraphql, udacityAuthToken);
}