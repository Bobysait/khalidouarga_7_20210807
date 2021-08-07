/*jshint esversion: 6 */

import React from 'react';
import Header from '../components/Body/Header';
import Footer from '../components/Body/Footer';
import Main from '../components/Body/Main';

const About = ({database}) => {
	return (
		<div className="about">

			<Header database={database} />
			<Main database={database} >

				<div className="cat-1">

					<section className="container">
				
						<h3 className="cat-title">À Propos</h3>

						<div className="cat-body">
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate harum voluptatum temporibus numquam et placeat reprehenderit ea accusamus soluta vitae!</p>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores consequatur hic ut qui? Et odit laudantium voluptatem fugiat nobis pariatur nihil illum, maiores fugit ducimus culpa placeat nostrum exercitationem ullam, vero cum magnam velit blanditiis consequatur perspiciatis, ipsum ad accusantium! Assumenda natus laborum odio ex minus beatae, sapiente repudiandae dolores, suscipit quibusdam expedita dolore? Iste dignissimos, at modi praesentium, vel a perferendis quisquam accusamus distinctio quibusdam eum sint similique animi dolorum dolore consequuntur possimus eaque ipsa quasi commodi placeat, accusantium delectus minima repellat? Ducimus doloremque amet earum a. Impedit illum commodi minus aliquam sit aperiam assumenda, placeat nam nesciunt, sint dicta quod sunt quia ipsum eius, quidem iste eos id illo? Dolorum sint officiis accusantium. Natus corporis, voluptas vitae culpa exercitationem, officia, eligendi ratione enim tempore sapiente ipsum quos eum animi officiis. Alias similique vitae voluptatum porro. Inventore, distinctio id?</p>
						</div>

					</section>
					
				</div>

			</Main>
			<Footer database={database}/>

		</div>
	);
};

export default About;