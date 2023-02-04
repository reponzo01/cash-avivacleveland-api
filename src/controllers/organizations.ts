import Organization from '../models/Organization';
import OrganizationUserRole from '../models/OrganizationUserRole';
import Role from '../models/Role';
import { StatusCodes } from 'http-status-codes';
import { Constants } from '../util/constants';

class OrganizationsController {
  public getOrganizations(
    req: any,
    res: any,
    next: any
  ): void {
    Organization.findAll({
      include: [
        {
          model: OrganizationUserRole,
          where: {
            userId: req.user.id,
          },
        },
      ],
    })
    .then((organizations) => {
      res.json(organizations);
    });
  }

  public getOrganizationById(
    req: any,
    res: any,
    next: any
  ): void {
    res.status(StatusCodes.NOT_FOUND).send('Not yet implemented.');
  }

  public postAddOrganization(
    req: any,
    res: any,
    next: any
  ): void {
    const name = req.body.name;
    const description = req.body.description;
    Organization.findOne({
      include: [
        {
          model: OrganizationUserRole,
          where: {
            userId: req.user.id,
          },
        },
      ],
      where: {
        name: name
      }
    })
    .then((foundOrganization) => {
      if (foundOrganization == null) {
        Organization.create({
          name: name,
          description: description
        })
        .then((createOrganization) => {
          Role.findOne({
            where: {
              name: Constants.ROLE_ADMIN
            }
          })
          .then((role) => {
            OrganizationUserRole.create({
              userId: req.user.id,
              roleId: role.id,
              organizationId: createOrganization.id
            })
            .then(() => {
              Organization.findOne({
                include: [
                  {
                    model: OrganizationUserRole,
                    where: {
                      userId: req.user.id,
                    },
                  },
                ],
                where: {
                  id: createOrganization.id
                }
              })
              .then((organization) => {
                res.status(StatusCodes.CREATED).json(organization);
              });
            })
          })
        })
      } else {
        res.status(StatusCodes.BAD_REQUEST).send('Organization name already exists.');
      }
    })
  }
}

export default new OrganizationsController();
