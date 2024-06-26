"""created tables

Revision ID: 970675963d88
Revises: 
Create Date: 2024-03-29 09:59:47.130838

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '970675963d88'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=345), nullable=False),
    sa.Column('_password_hash', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('username', name=op.f('uq_users_username'))
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tweet', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('lat', sa.Numeric(scale=8), nullable=True),
    sa.Column('lng', sa.Numeric(scale=8), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_comments'))
    )
    op.create_table('destinations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('destination', sa.String(), nullable=False),
    sa.Column('start', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_destinations_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_destinations'))
    )
    op.create_table('friends',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('selfuser_id', sa.Integer(), nullable=True),
    sa.Column('friend_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], name=op.f('fk_friends_friend_id_users')),
    sa.ForeignKeyConstraint(['selfuser_id'], ['users.id'], name=op.f('fk_friends_selfuser_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_friends'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friends')
    op.drop_table('destinations')
    op.drop_table('comments')
    op.drop_table('users')
    # ### end Alembic commands ###
