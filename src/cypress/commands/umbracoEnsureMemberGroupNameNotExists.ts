﻿import CommandBase from './commandBase';
import { ResponseHelper } from '../../helpers/responseHelper';

export default class UmbracoEnsureMemberGroupNameNotExists extends CommandBase {
  _commandName = 'umbracoEnsureMemberGroupNameNotExists';

  method(name) {
    const cy = this.cy;

    cy.getCookie('UMB-XSRF-TOKEN', { log: false }).then((token) => {
      cy.request({
        method: 'GET',
        url: this._relativeBackOfficePath + '/backoffice/UmbracoTrees/MemberGroupTree/GetNodes?id=-1',
        followRedirect: true,
        headers: {
          Accept: 'application/json',
          'X-UMB-XSRF-TOKEN': token.value,
        },
        log: false,
      }).then((response) => {
        const searchBody = ResponseHelper.getResponseBody(response);
        if (searchBody.length > 0) {
          let memberGroupId = null;
          for (const sb of searchBody) {
            if (sb.name === name) {
              memberGroupId = sb.id;
            }
          }

          if (memberGroupId !== null) {
            cy.request({
              method: 'POST',
              url: this._relativeBackOfficePath + '/backoffice/UmbracoApi/MemberGroup/DeleteById?id=' + memberGroupId,
              followRedirect: false,
              headers: {
                ContentType: 'application/json',
                'X-UMB-XSRF-TOKEN': token.value,
              },
            }).then((resp) => {
              return;
            });
          }
        }
      });
    });
  }
}
