import graphene

import users.schema
import collect_ease.schema
import recycle_market.schema
import finance.schema
import platform_core.schema
import graphql_jwt


class Query(
    users.schema.Query,
    collect_ease.schema.Query,
    recycle_market.schema.Query,
    finance.schema.Query,
    platform_core.schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    users.schema.Mutation,
    collect_ease.schema.Mutation,
    recycle_market.schema.Mutation,
    finance.schema.Mutation,
    platform_core.schema.Mutation,
    graphene.ObjectType,
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
