export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">About Anveshna</h1>

            <div className="space-y-6 text-muted-foreground">
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        What is Anveshna?
                    </h2>
                    <p className="leading-relaxed">
                        Anveshna is a comprehensive anime streaming platform
                        designed to provide anime enthusiasts with a seamless
                        viewing experience. We offer a vast collection of anime
                        titles, from classic series to the latest releases, all
                        in one convenient location.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Our Mission
                    </h2>
                    <p className="leading-relaxed">
                        Our mission is to make anime accessible to everyone,
                        providing high-quality streaming with an intuitive
                        interface that enhances your viewing experience. We
                        strive to build a community where anime fans can
                        discover, watch, and enjoy their favorite shows.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Features
                    </h2>
                    <ul className="list-disc list-inside space-y-2 leading-relaxed">
                        <li>Extensive anime library with multiple genres</li>
                        <li>
                            High-quality streaming with multiple video sources
                        </li>
                        <li>Watch history tracking</li>
                        <li>Trending and popular anime recommendations</li>
                        <li>Advanced search and filtering options</li>
                        <li>Responsive design for all devices</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Disclaimer
                    </h2>
                    <p className="leading-relaxed">
                        This website does not retain any files on its server.
                        Rather, it solely provides links to media content hosted
                        by third-party services. All content is provided by
                        third-party services and we do not host any files.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">
                        Contact
                    </h2>
                    <p className="leading-relaxed">
                        For any questions, concerns, or feedback, please reach
                        out to us through our social media channels listed in
                        the footer.
                    </p>
                </section>
            </div>
        </div>
    );
}
